using lukes_site.Server.Models;

namespace lukes_site.Server.Repos
{
    public interface IBlogPostRepository
    {
        IEnumerable<BlogPost> GetAllPosts();
        void AddPost(BlogPost post);
    }
}
