using lukes_site.Server.Models;
using lukes_site.Server.Repos;
using lukes_site.Server.Services;
using Microsoft.AspNetCore.Mvc;

[Route("api/BlogPosts")]
[ApiController]
public class BlogPostsController : ControllerBase
{
    private readonly IBlogService _blogService;
    private readonly ILogger<BlogPostsController> _logger;

    public BlogPostsController(IBlogService blogService, ILogger<BlogPostsController> logger)
    {
        _blogService = blogService;
        _logger = logger;
    }

    // GET: api/BlogPosts
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BlogPost>>> GetBlogPosts()
    {
        try
        {
            var posts = await _blogService.GetAllPostsAsync();
            return Ok(posts);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting blog posts");
            return StatusCode(500, "An error occurred while retrieving blog posts");
        }
    }

    // GET: api/BlogPosts/5
    [HttpGet("{id}")]
    public async Task<ActionResult<BlogPost>> GetBlogPost(string id)
    {
        try
        {
            var post = await _blogService.GetPostBySlugAsync(id);
            if (post == null)
            {
                return NotFound();
            }
            return post;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting blog post {Id}", id);
            return StatusCode(500, "An error occurred while retrieving the blog post");
        }
    }
}
