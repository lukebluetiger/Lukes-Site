using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Hosting;
using Moq;
using Xunit;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using lukes_site.Server.Models;
using lukes_site.Server.Services;

namespace lukes_site.Server.Tests.Unit.Controllers
{
    public class BlogPostsControllerTests
    {
        private readonly Mock<IBlogService> _mockBlogService;  // Change to interface
        private readonly Mock<ILogger<BlogPostsController>> _mockLogger;
        private readonly BlogPostsController _controller;

        public BlogPostsControllerTests()
        {
            _mockBlogService = new Mock<IBlogService>();  // Mock the interface instead
            _mockLogger = new Mock<ILogger<BlogPostsController>>();
            _controller = new BlogPostsController(_mockBlogService.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task GetBlogPosts_ReturnsOkResultWithPosts()
        {
            // Arrange
            var expectedPosts = new List<BlogPost>
            {
                new BlogPost {
                    Title = "Test Post 1",
                    Slug = "test-1",
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
                    Tags = new List<string> { "test" },
                    Metadata = new PostMetadata
                    {
                        ReadingTime = "1 min read",
                        Views = 0,
                        Featured = false
                    }
                },
                new BlogPost {
                    Title = "Test Post 2",
                    Slug = "test-2",
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
                }
            };

            _mockBlogService.Setup(service => service.GetAllPostsAsync())
                .ReturnsAsync(expectedPosts);

            // Act
            var result = await _controller.GetBlogPosts();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var posts = Assert.IsAssignableFrom<IEnumerable<BlogPost>>(okResult.Value);
            Assert.Equal(2, posts.Count());
        }

        [Fact]
        public async Task GetBlogPost_WithValidSlug_ReturnsPost()
        {
            // Arrange
            var expectedPost = new BlogPost
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

            _mockBlogService.Setup(service => service.GetPostBySlugAsync("test-post"))
                .ReturnsAsync(expectedPost);

            // Act
            var result = await _controller.GetBlogPost("test-post");

            // Assert
            Assert.NotNull(result.Value);
            Assert.Equal("Test Post", result.Value.Title);
        }

        [Fact]
        public async Task GetBlogPost_WithInvalidSlug_ReturnsNotFound()
        {
            // Arrange
            _mockBlogService.Setup(service => service.GetPostBySlugAsync(It.IsAny<string>()))
                .ReturnsAsync((BlogPost?)null);

            // Act
            var result = await _controller.GetBlogPost("non-existent");

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task GetBlogPost_WhenExceptionOccurs_Returns500()
        {
            // Arrange
            _mockBlogService.Setup(service => service.GetPostBySlugAsync(It.IsAny<string>()))
                .ThrowsAsync(new Exception("Test exception"));

            // Act
            var result = await _controller.GetBlogPost("test-post");

            // Assert
            var statusCodeResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(500, statusCodeResult.StatusCode);
        }
    }
}