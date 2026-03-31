import { fetchPrUrl, GitHubClient } from "@/shared/infrastructure/github/fetch-pr-url";

describe("fetchPrUrl", () => {
  it("should return the PR URL when GitHub API responds with data", async () => {
    // Arrange
    const expectedUrl = "https://github.com/owner/repo/pull/1";
    const mockOctokit: GitHubClient = {
      pulls: {
        get: jest.fn().mockResolvedValue({
          data: {
            html_url: expectedUrl,
          },
        }),
      },
    };

    // Act
    const result = await fetchPrUrl(mockOctokit, "owner", "repo", 1);

    // Assert
    expect(result).toBe(expectedUrl);
    expect(mockOctokit.pulls.get).toHaveBeenCalledWith({
      owner: "owner",
      repo: "repo",
      pull_number: 1,
    });
  });
});
