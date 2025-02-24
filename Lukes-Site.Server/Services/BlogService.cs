using System.Text.Json;
using System.Text.Json.Serialization;
using lukes_site.Server.Models;

namespace lukes_site.Server.Services
{
   public class BlogService : IBlogService
{
    private readonly string _postsDirectory;
    private readonly ILogger<BlogService> _logger;
    private readonly JsonSerializerOptions _jsonOptions;

    public BlogService(IWebHostEnvironment env, ILogger<BlogService> logger)
    {
        _postsDirectory = Path.Combine(env.ContentRootPath, "posts");
        _logger = logger;
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
        };
    }

    public async Task<IEnumerable<BlogPost>> GetAllPostsAsync()
    {
        var posts = new List<BlogPost>();
        
        try 
        {
            if (!Directory.Exists(_postsDirectory))
            {
                _logger.LogError("Posts directory does not exist: {Directory}", _postsDirectory);
                return posts;
            }

            var files = Directory.GetFiles(_postsDirectory, "*.json", SearchOption.AllDirectories);
            _logger.LogInformation("Found {Count} JSON files in {Directory}", files.Length, _postsDirectory);

            foreach (var file in files)
            {
                try
                {
                    var json = await File.ReadAllTextAsync(file);
                    _logger.LogInformation("Reading file: {File}", file);
                    
                    var post = JsonSerializer.Deserialize<BlogPost>(json, _jsonOptions);
                    
                    if (post != null)
                    {
                        var fileInfo = new FileInfo(file);
                        post.CreatedAt = fileInfo.CreationTime;
                        post.UpdatedAt = fileInfo.LastWriteTime;
                        posts.Add(post);
                        _logger.LogInformation("Successfully loaded post: {Title}", post.Title);
                    }
                }
                catch (JsonException ex)
                {
                    _logger.LogError(ex, "JSON deserialization error in file {File}: {Message}", file, ex.Message);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing file {File}: {Message}", file, ex.Message);
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error accessing posts directory: {Message}", ex.Message);
        }

        return posts.OrderByDescending(p => p.CreatedAt);
    }

    public async Task<BlogPost?> GetPostBySlugAsync(string slug)
    {
        var posts = await GetAllPostsAsync();
        return posts.FirstOrDefault(p => p.Slug.Equals(slug, StringComparison.OrdinalIgnoreCase));
    }

    public async Task<IEnumerable<BlogPost>> GetPostsByTagAsync(string tag)
    {
        var posts = await GetAllPostsAsync();
        return posts.Where(p => p.Tags.Contains(tag, StringComparer.OrdinalIgnoreCase));
    }
}
}