export interface GitHubPullsClient {
  get(params: {
    owner: string;
    repo: string;
    pull_number: number;
  }): Promise<{ data: { html_url: string } }>;
}

export interface GitHubClient {
  pulls: GitHubPullsClient;
}

export async function fetchPrUrl(
  octokit: GitHubClient,
  owner: string,
  repo: string,
  pullNumber: number
): Promise<string> {
  const { data } = await octokit.pulls.get({
    owner,
    repo,
    pull_number: pullNumber,
  });
  return data.html_url;
}
