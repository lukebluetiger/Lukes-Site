 using Microsoft.EntityFrameworkCore;
 using lukes_site.Server.Models;

   namespace lukes_site.Server.Data
   {
       public class BlogDbContext : DbContext
       {
           public BlogDbContext(DbContextOptions<BlogDbContext> options) : base(options) { }

           public DbSet<BlogPost> BlogPosts { get; set; }
       }
   }