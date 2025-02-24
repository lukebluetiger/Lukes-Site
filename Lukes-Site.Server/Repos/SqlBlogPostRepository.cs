   using lukes_site.Server.Models;
   using lukes_site.Server.Data;
   using System.Collections.Generic;
   using System.Linq;
   using Microsoft.EntityFrameworkCore;

   namespace lukes_site.Server.Repos
   {
       public class SqlBlogPostRepository : IBlogPostRepository
       {
           private readonly BlogDbContext _context;

           public SqlBlogPostRepository(BlogDbContext context)
           {
               _context = context;
           }

           public IEnumerable<BlogPost> GetAllPosts() => _context.BlogPosts.ToList();

           

           public void AddPost(BlogPost post)
           {
               _context.BlogPosts.Add(post);
               _context.SaveChanges();
           }
   }
}