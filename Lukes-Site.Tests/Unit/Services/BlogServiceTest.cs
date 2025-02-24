using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Hosting;
using Moq;
using Xunit;
using System.Text.Json;
using lukes_site.Server.Models;
using lukes_site.Server.Services;

namespace lukes_site.Server.Tests.Unit.Services
{
    public class BlogServiceTests : IDisposable
    {
        private readonly Mock<IWebHostEnvironment> _mockEnv;
        private readonly Mock<ILogger<BlogService>> _mockLogger;
        private readonly string _testDirectory;
        private readonly BlogService _blogService;

        public BlogServiceTests()
        {
            _mockEnv = new Mock<IWebHostEnvironment>();
            _mockLogger = new Mock<ILogger<BlogService>>();
            _testDirectory = Path.Combine(Path.GetTempPath(), "test-posts");
            
            _testDirectory = Path.Combine(Path.GetTempPath(), Path.GetRandomFileName());
            Directory.CreateDirectory(_testDirectory);
            _mockEnv.Setup(e => e.ContentRootPath).Returns(_testDirectory);
            _blogService = new BlogService(_mockEnv.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task GetAllPostsAsync_EmptyDirectory_ReturnsEmptyList()
        {
            // Arrange
            if (Directory.Exists(_testDirectory))
            {
                Directory.Delete(_testDirectory, true);
            }

            // Act
            var result = await _blogService.GetAllPostsAsync();

            // Assert
            Assert.Empty(result);
        }

        [Fact]
        public async Task GetAllPostsAsync_WithValidPosts_ReturnsOrderedPosts()
        {
            // Arrange
            if (Directory.Exists(_testDirectory))
            {
                Directory.Delete(_testDirectory, true);
            }
            Directory.CreateDirectory(_testDirectory);

            var post1 = new BlogPost
            {
                Title = "Test Post 1",
                Slug = "test-post-1",
                Author = "Test Author",
                Summary = "Test summary 1",
                Content = new List<ContentBlock>
                {
                    new ContentBlock
                    {
                        Type = "paragraph",
                        Content = "Test content 1"
                    }
                },
                Tags = new List<string> { "test", "first" },
                CreatedAt = DateTime.Now.AddDays(-1),
                Metadata = new PostMetadata
                {
                    ReadingTime = "1 min read",
                    Views = 0,
                    Featured = false
                }
            };

            var post2 = new BlogPost
            {
                Title = "Test Post 2",
                Slug = "test-post-2",
                Author = "Test Author",
                Summary = "Test summary 2",
                Content = new List<ContentBlock>
                {
                    new ContentBlock
                    {
                        Type = "paragraph",
                        Content = "Test content 2"
                    }
                },
                Tags = new List<string> { "test", "second" },
                CreatedAt = DateTime.Now,
                Metadata = new PostMetadata
                {
                    ReadingTime = "1 min read",
                    Views = 0,
                    Featured = false
                }
            };

            await File.WriteAllTextAsync(
                Path.Combine(_testDirectory, "1.json"),
                JsonSerializer.Serialize(post1)
            );

            await File.WriteAllTextAsync(
                Path.Combine(_testDirectory, "2.json"),
                JsonSerializer.Serialize(post2)
            );

            // Act
            var result = await _blogService.GetAllPostsAsync();

            // Assert
            var posts = result.ToList();
            Assert.Equal(2, posts.Count);
            Assert.Equal("Test Post 1", posts[1].Title); // Ordered by CreatedAt descending
            Assert.Equal("Test Post 2", posts[0].Title);
        }

        [Fact]
        public async Task GetPostBySlugAsync_ExistingSlug_ReturnsPost()
        {
            // Arrange
            if (Directory.Exists(_testDirectory))
            {
                Directory.Delete(_testDirectory, true);
            }
            Directory.CreateDirectory(_testDirectory);

            var post = new BlogPost
            {
                Title = "Test Post",
                Slug = "test-post",
                Author = "Test Author",
                Summary = "Test summary",
                Content = new List<ContentBlock>
                {
                    new ContentBlock
                    {
                        Type = "paragraph",
                        Content = "Test content"
                    }
                },
                Tags = new List<string> { "test" },
                Metadata = new PostMetadata
                {
                    ReadingTime = "1 min read",
                    Views = 0,
                    Featured = false
                }
            };

            await File.WriteAllTextAsync(
                Path.Combine(_testDirectory, "1.json"),
                JsonSerializer.Serialize(post)
            );

            // Act
            var result = await _blogService.GetPostBySlugAsync("test-post");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Test Post", result.Title);
        }

        [Fact]
        public async Task GetPostsByTagAsync_ExistingTag_ReturnsPosts()
        {
            // Arrange
            if (Directory.Exists(_testDirectory))
            {
                Directory.Delete(_testDirectory, true);
            }
            Directory.CreateDirectory(_testDirectory);

            var post1 = new BlogPost
            {
                Title = "Test Post 1",
                Slug = "test-post-1",
                Author = "Test Author",
                Summary = "Test summary 1",
                Content = new List<ContentBlock>
                {
                    new ContentBlock
                    {
                        Type = "paragraph",
                        Content = "Test content 1"
                    }
                },
                Tags = new List<string> { "test", "featured" },
                Metadata = new PostMetadata
                {
                    ReadingTime = "1 min read",
                    Views = 0,
                    Featured = true
                }
            };

            var post2 = new BlogPost
            {
                Title = "Test Post 2",
                Slug = "test-post-2",
                Author = "Test Author",
                Summary = "Test summary 2",
                Content = new List<ContentBlock>
                {
                    new ContentBlock
                    {
                        Type = "paragraph",
                        Content = "Test content 2"
                    }
                },
                Tags = new List<string> { "test" },
                Metadata = new PostMetadata
                {
                    ReadingTime = "1 min read",
                    Views = 0,
                    Featured = false
                }
            };

            await File.WriteAllTextAsync(
                Path.Combine(_testDirectory, "1.json"),
                JsonSerializer.Serialize(post1)
            );

            await File.WriteAllTextAsync(
                Path.Combine(_testDirectory, "2.json"),
                JsonSerializer.Serialize(post2)
            );

            // Act
            var result = await _blogService.GetPostsByTagAsync("featured");

            // Assert
            var posts = result.ToList();
            Assert.Single(posts);
            Assert.Equal("Test Post 1", posts[0].Title);
        }

        [Fact]
        public void Dispose()
        {
            if (Directory.Exists(_testDirectory))
            {
                Directory.Delete(_testDirectory, true);
            }
        }
    }
}