using lukes_site.Server.Models;

namespace lukes_site.Server.Services
{
    public interface IBlogService
    {
        Task<IEnumerable<BlogPost>> GetAllPostsAsync();
        Task<BlogPost?> GetPostBySlugAsync(string slug);
    }
}
