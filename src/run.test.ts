import * as github from '@actions/github';
import * as githubUtils from '@actions/github/lib/utils';
import { throttling } from '@octokit/plugin-throttling';
import * as core from '@actions/core';
import { when } from 'jest-when';
import { Result } from './result';
import { run } from './run';

type BumpType = 'none' | 'patch' | 'minor' | 'major' | 'impossible';
const bumpTypes: BumpType[] = ['none', 'patch', 'minor', 'major', 'impossible'];
const possibleBumpTypes = bumpTypes.filter((type) => type !== 'impossible');

type VersionChange = {
	before: {
		dev?: Record<string, string>;
		prod?: Record<string, string>;
	};
	after: {
		dev?: Record<string, string>;
		prod?: Record<string, string>;
	};
	minRequired: { dev: BumpType; prod: BumpType };
};

const versionChanges: VersionChange[] = [
	{
		before: { dev: { mod1: '0.0.1' } },
		after: { dev: { mod1: '0.0.2' } },
		minRequired: { dev: 'patch', prod: 'none' },
	},
	{
		before: { prod: { mod1: '0.0.1' } },
		after: { prod: { mod1: '0.0.2' } },
		minRequired: { dev: 'none', prod: 'patch' },
	},
	{
		before: { dev: { mod1: '0.0.1' }, prod: { mod2: '0.0.1' } },
		after: { dev: { mod1: '0.0.1' }, prod: { mod2: '0.1.0' } },
		minRequired: { dev: 'none', prod: 'minor' },
	},
	{
		before: { dev: { mod1: '0.0.2' } },
		after: { dev: { mod1: '0.0.1' } },
		minRequired: { dev: 'impossible', prod: 'none' },
	},
	{
		before: { dev: { mod1: '^0.0.1' } },
		after: { dev: { mod1: '^0.0.2' } },
		minRequired: { dev: 'patch', prod: 'none' },
	},
	{
		before: { dev: { mod1: '~0.0.1' } },
		after: { dev: { mod1: '~0.0.2' } },
		minRequired: { dev: 'patch', prod: 'none' },
	},
	{
		before: { dev: { mod1: '~0.0.1' } },
		after: { dev: { mod1: '0.0.2' } },
		minRequired: { dev: 'impossible', prod: 'none' },
	},
	{
		before: { dev: { mod1: '0.0.1' } },
		after: { dev: { mod1: '~0.0.2' } },
		minRequired: { dev: 'impossible', prod: 'none' },
	},
	{
		before: { dev: { mod1: '0.0.1' } },
		after: { dev: { mod1: '0.1.0' } },
		minRequired: { dev: 'minor', prod: 'none' },
	},
	{
		before: { dev: { mod1: '0.0.1' } },
		after: { dev: { mod1: '1.0.0' } },
		minRequired: { dev: 'major', prod: 'none' },
	},
	{
		before: { dev: { mod1: '0.0.1-alpha' } },
		after: { dev: { mod1: '0.0.1' } },
		minRequired: { dev: 'impossible', prod: 'none' },
	},
	{
		before: { dev: { mod1: '0.0.1-alpha' } },
		after: { dev: { mod1: '0.0.2' } },
		minRequired: { dev: 'impossible', prod: 'none' },
	},
	{
		before: { dev: { mod1: '!0.0.1' } },
		after: { dev: { mod1: '0.0.2' } },
		minRequired: { dev: 'impossible', prod: 'none' },
	},
	{
		before: { dev: { mod1: '0.0.1' } },
		after: { dev: { mod1: '!0.0.2' } },
		minRequired: { dev: 'impossible', prod: 'none' },
	},
	{
		before: { dev: { mod1: 1 as any } },
		after: { dev: { mod1: '0.0.1' } },
		minRequired: { dev: 'impossible', prod: 'none' },
	},
	{
		before: { dev: { mod1: '0.0.1' } },
		after: { dev: { mod1: 1 as any } },
		minRequired: { dev: 'impossible', prod: 'none' },
	},
];

const realSetTimeout = setTimeout;
function whenAllPromisesFinished(): Promise<void> {
	return new Promise((resolve) => realSetTimeout(() => resolve(), 0));
}

const allowedUpdateTypeCombinations: {
	allowedUpdateTypes: string;
	maxBump: { dev: BumpType; prod: BumpType };
}[] = [];
possibleBumpTypes.forEach((prodBumpType) => {
	possibleBumpTypes.forEach((devBumpType) => {
		const allowedUpdateTypes: string[] = [];
		(['dev', 'prod'] as const).forEach((type) => {
			for (
				let i = bumpTypes.indexOf(type === 'dev' ? devBumpType : prodBumpType);
				i >= 0;
				i--
			) {
				if (bumpTypes[i] !== 'none') {
					allowedUpdateTypes.push(
						`${type === 'dev' ? 'devDependencies' : 'dependencies'}:${bumpTypes[i]}`
					);
				}
			}
		});

		allowedUpdateTypeCombinations.push({
			allowedUpdateTypes: allowedUpdateTypes.join(', '),
			maxBump: { dev: devBumpType, prod: prodBumpType },
		});
	});
});

describe('run', () => {
	beforeEach(() => {
		jest.useFakeTimers('modern').setSystemTime(0);
		(github as any).context = {};
	});

	afterEach(() => jest.useRealTimers());

	it('stops if the event name is unknown', async () => {
		github.context.eventName = 'unknown';
		expect(await run()).toBe(Result.UnknownEvent);
	});

	['pull_request', 'pull_request_target'].forEach((name) => {
		describe(`when the event name is ${name}`, () => {
			let mockAllowedActors: string;
			let mockAllowedUpdateTypes: string;
			let mockPackageBlockList: string;
			let mockMergeMethod: string;
			let mockMergeAuthorEmail: string | null;

			beforeEach(() => {
				github.context.eventName = name;
				mockAllowedActors = '';
				mockAllowedUpdateTypes = '';
				mockPackageBlockList = '';
				mockMergeMethod = 'SQUASH';
				mockMergeAuthorEmail = '';

				const getInputMock = when(core.getInput as any).mockImplementation(() => {
					throw new Error('Unexpected call');
				});
				getInputMock
					.calledWith('github-token', { required: true })
					.mockReturnValue('token');
				getInputMock
					.calledWith('allowed-actors', { required: true })
					.mockImplementation(() => mockAllowedActors);
				getInputMock
					.calledWith('allowed-update-types', { required: true })
					.mockImplementation(() => mockAllowedUpdateTypes);
				getInputMock
					.calledWith('package-block-list')
					.mockImplementation(() => mockPackageBlockList);
				getInputMock.calledWith('merge-method').mockImplementation(() => mockMergeMethod);
				getInputMock
					.calledWith('merge-author-email')
					.mockImplementation(() => mockMergeAuthorEmail);
			});

			it('stops if the actor is not in the allow list', async () => {
				github.context.actor = 'unknown';
				expect(await run()).toBe(Result.ActorNotAllowed);
			});

			it('stops if the merge method is unknown', async () => {
				mockMergeMethod = 'unknown';
				expect(await run()).toBe(Result.UnknownMergeMethod);
			});

			describe('with an allowed actor', () => {
				let mockPackageJsonPr: any;
				let mockPackageJsonBase: any;
				let mockCommit: any;
				let mockPr: any;
				let reposGetContentMock: jest.Mock;
				let graphqlMock: jest.Mock;
				const mockSha = 'mockSha';

				beforeEach(() => {
					mockAllowedActors = 'actor1, actor2';
					mockPackageJsonPr = {};
					mockPackageJsonBase = {};
					mockMergeMethod = 'SQUASH';
					mockMergeAuthorEmail = null;

					github.context.actor = 'actor2';
					(github.context as any).repo = {
						owner: 'repoOwner',
						repo: 'repo ',
					};
					(github.context as any).payload = {
						pull_request: {
							number: 1,
							base: {
								sha: 'baseSha',
							},
							head: {
								sha: 'headSha',
							},
							node_id: 'nodeId==',
						},
					};
					mockCommit = {
						data: {
							files: [
								{ filename: 'package.json', status: 'modified' },
								{ filename: 'package-lock.json', status: 'modified' },
								{ filename: 'yarn.lock', status: 'modified' },
							],
						},
					};
					mockPr = {};

					reposGetContentMock = jest.fn();
					when(reposGetContentMock)
						.mockImplementation(() => {
							throw new Error('Unexpected call');
						})
						.calledWith({
							owner: github.context.repo.owner,
							repo: github.context.repo.repo,
							path: 'package.json',
							ref: (github.context.payload.pull_request as any).head.sha,
						})
						.mockImplementation(() =>
							Promise.resolve({
								data: {
									type: 'file',
									encoding: 'base64',
									content: Buffer.from(
										JSON.stringify(mockPackageJsonPr, null, 2)
									).toString('base64'),
								},
							})
						)
						.calledWith({
							owner: github.context.repo.owner,
							repo: github.context.repo.repo,
							path: 'package.json',
							ref: (github.context.payload.pull_request as any).base.sha,
						})
						.mockImplementation(() =>
							Promise.resolve({
								data: {
									type: 'file',
									encoding: 'base64',
									content: Buffer.from(
										JSON.stringify(mockPackageJsonBase, null, 2)
									).toString('base64'),
								},
							})
						);

					const reposGetCommitMock = jest.fn();
					when(reposGetCommitMock)
						.expectCalledWith({
							owner: github.context.repo.owner,
							repo: github.context.repo.repo,
							ref: (github.context.payload.pull_request as any).head.sha,
						})
						.mockImplementation(() => mockCommit);

					const pullsGetMock = jest.fn();
					when(pullsGetMock)
						.expectCalledWith({
							owner: github.context.repo.owner,
							repo: github.context.repo.repo,
							pull_number: github.context.payload.pull_request!.number,
						})
						.mockImplementation(() => mockPr);

					graphqlMock = jest.fn();
					when(graphqlMock)
						.expectCalledWith(
							`mutation($pullRequestId: ID!, $mergeMethod: PullRequestMergeMethod, $authorEmail: String) {
	enablePullRequestAutoMerge(input: {pullRequestId: $pullRequestId, mergeMethod: $mergeMethod, authorEmail: $authorEmail}) {
		pullRequest {
			autoMergeRequest {
				enabledAt
			}
		}
	}
}`,
							{
								pullRequestId: github.context.payload.pull_request!.node_id,
								mergeMethod: mockMergeMethod,
								authorEmail: mockMergeAuthorEmail,
							}
						)
						.mockImplementation(() =>
							Promise.resolve({
								enablePullRequestAutoMerge: {
									pullRequest: {
										autoMergeRequest: {
											enabledAt: '2021-03-07T16:17:20Z',
										},
									},
								},
							})
						);

					const octokitMock = {
						repos: {
							getContent: reposGetContentMock,
							getCommit: reposGetCommitMock,
						},
						pulls: {
							get: pullsGetMock,
						},
						graphql: graphqlMock,
					};

					const getOctokitOptionsReturn = Symbol('getOctokitOptionsReturn');
					when((githubUtils as any).getOctokitOptions)
						.expectCalledWith('token', {
							throttle: expect.objectContaining({
								onRateLimit: expect.any(Function),
								onAbuseLimit: expect.any(Function),
							}),
						})
						.mockReturnValue(getOctokitOptionsReturn);

					const octokitMockBuilder = jest.fn();
					when(octokitMockBuilder)
						.expectCalledWith(getOctokitOptionsReturn)
						.mockReturnValue(octokitMock);

					when((githubUtils.GitHub as any).plugin)
						.expectCalledWith(throttling)
						.mockReturnValue(octokitMockBuilder);
				});

				it('errors if allowed-update-types invalid', async () => {
					mockAllowedUpdateTypes = 'invalid';
					await expect(run()).rejects.toHaveProperty(
						'message',
						'allowed-update-types invalid'
					);
				});

				it('errors if the content type is incorrect', async () => {
					reposGetContentMock.mockReturnValue(
						Promise.resolve({ data: { type: 'unknown' } })
					);
					await expect(run()).rejects.toHaveProperty(
						'message',
						'Unexpected repo content response'
					);
				});

				it('errors if the content encoding is incorrect', async () => {
					reposGetContentMock.mockReturnValue(
						Promise.resolve({ data: { type: 'file', encoding: 'unknown' } })
					);
					await expect(run()).rejects.toHaveProperty(
						'message',
						'Unexpected repo content response'
					);
				});

				it('stops if more than the allowed files change', async () => {
					mockCommit.data.files = [{ filename: 'something', status: 'modified' }];
					expect(await run()).toBe(Result.FileNotAllowed);

					mockCommit.data.files = [
						{ filename: 'package.json', status: 'modified' },
						{ filename: 'something', status: 'modified' },
					];
					expect(await run()).toBe(Result.FileNotAllowed);
				});

				it('stops if an allowed file is changed but not modified', async () => {
					mockCommit.data.files = [{ filename: 'package.json', status: 'something' }];
					expect(await run()).toBe(Result.FileNotAllowed);
				});

				it('stops if the diff of the package.json contains additions', async () => {
					mockPackageJsonPr = { addition: true };
					expect(await run()).toBe(Result.UnexpectedChanges);
				});

				it('stops if the diff of the package.json contains removals', async () => {
					mockPackageJsonBase = { addition: true };
					expect(await run()).toBe(Result.UnexpectedChanges);
				});

				it('stops if the diff of the package.json contains changes to something other than dependencies or devDependencies', async () => {
					mockPackageJsonBase.name = 'something';
					mockPackageJsonPr.name = 'somethingElse';
					expect(await run()).toBe(Result.UnexpectedPropertyChange);
				});

				it('stops if one of the updates is in the package block list', async () => {
					mockAllowedUpdateTypes = 'dependencies: patch';
					mockPackageBlockList = 'dep1, dep2';

					mockPackageJsonBase.dependencies = {
						dep1: '1.2.3',
					};
					mockPackageJsonPr.dependencies = {
						dep1: '1.2.4',
					};
					expect(await run()).toBe(Result.VersionChangeNotAllowed);

					mockPackageJsonBase.dependencies = {
						dep1: '1.2.3',
						dep2: '1.2.3',
					};
					mockPackageJsonPr.dependencies = {
						dep1: '1.2.4',
						dep2: '1.2.4',
					};
					expect(await run()).toBe(Result.VersionChangeNotAllowed);

					mockPackageJsonBase.dependencies = {
						dep1: '1.2.3',
						something: '1.2.3',
					};
					mockPackageJsonPr.dependencies = {
						dep1: '1.2.4',
						something: '1.2.4',
					};
					expect(await run()).toBe(Result.VersionChangeNotAllowed);
				});

				versionChanges.forEach(({ before, after, minRequired }) => {
					describe(`with an update from ${JSON.stringify(before)} to "${JSON.stringify(
						after
					)}"`, () => {
						beforeEach(() => {
							if (before.dev) {
								mockPackageJsonBase.devDependencies = before.dev;
							}
							if (before.prod) {
								mockPackageJsonBase.dependencies = before.prod;
							}
							if (after.dev) {
								mockPackageJsonPr.devDependencies = after.dev;
							}
							if (after.prod) {
								mockPackageJsonPr.dependencies = after.prod;
							}
						});

						allowedUpdateTypeCombinations.forEach(({ allowedUpdateTypes, maxBump }) => {
							describe(`with allowedUpdateTypes of "${allowedUpdateTypes}"`, () => {
								beforeEach(() => {
									mockAllowedUpdateTypes = allowedUpdateTypes;
								});

								if (
									bumpTypes.indexOf(maxBump.dev) <
										bumpTypes.indexOf(minRequired.dev) ||
									bumpTypes.indexOf(maxBump.prod) <
										bumpTypes.indexOf(minRequired.prod)
								) {
									it('stops', async () => {
										expect(await run()).toBe(Result.VersionChangeNotAllowed);
									});
								} else {
									beforeEach(() => {
										mockPr.data = {
											state: 'open',
											mergeable: true,
											head: { sha: mockSha },
										};
									});

									it('enables auto-merge for the PR', async () => {
										expect(await run()).toBe(Result.Success);
									});

									it('aborts if the PR is not open', async () => {
										mockPr.data.state = 'unknown';
										expect(await run()).toBe(Result.PRNotOpen);
									});

									it('errors if auto-merge failed', async () => {
										graphqlMock.mockReturnValue(Promise.resolve(null));
										await expect(run()).rejects.toHaveProperty(
											'message',
											'Failed to enable auto-merge'
										);
									});
								}
							});
						});
					});
				});
			});
		});
	});
});
