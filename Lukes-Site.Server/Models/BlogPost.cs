// Models/BlogPost.cs

namespace lukes_site.Server.Models {

    public class BlogPost
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Slug { get; set; }
        public required string Author { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public List<string> Tags { get; set; } = new();
        public required string Summary { get; set; }
        public CoverImage? CoverImage { get; set; }
        public List<ContentBlock> Content { get; set; } = new();
        public PostMetadata Metadata { get; set; } = new PostMetadata      {          
            ReadingTime = "1 min read",  // Default value         
            Views = 0,         
            Featured = false     };  
    }

    public class ContentBlock
    {
        public required string Type { get; set; }
        public string? Content { get; set; }  // Made nullable
        public string? Language { get; set; }
        public string? Url { get; set; }
        public string? Alt { get; set; }
        public string? Caption { get; set; }
        public int? HeaderLevel { get; set; }
        public List<string>? Items { get; set; }
    }
    public class PostMetadata
    {
        public int Views { get; set; }
        public required string ReadingTime { get; set; }
        public bool Featured { get; set; }
    }
}