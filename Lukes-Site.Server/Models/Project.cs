using System.Text.Json.Serialization;

namespace lukes_site.Server.Models
{
    public class Project
    {
        public string Slug { get; set; }
        public string Title { get; set; }
        public string Summary { get; set; }
        public string Technologies { get; set; }  // Comma-separated in JSON
        public string GithubUrl { get; set; }
        public string LiveUrl { get; set; }
        public string CoverImageUrl { get; set; }
        public string CoverImageAlt { get; set; }
        public string Features { get; set; }
        public string Status { get; set; }
        public DateTime StartDate { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public ProjectDto ToDto()
        {
            return new ProjectDto
            {
                Slug = Slug,
                Title = Title,
                Summary = Summary,
                Technologies = Technologies?.Split(',').Select(t => t.Trim()).ToList(),
                GithubUrl = GithubUrl,
                LiveUrl = LiveUrl,
                CoverImage = new CoverImage 
                {
                    // Convert relative path to absolute path for frontend
                    Url = CoverImageUrl?.Replace("./", "/"),
                    Alt = CoverImageAlt
                },
                Features = Features?.Split(',').Select(f => f.Trim()).ToList(),
                Status = Status,
                StartDate = StartDate,
                Description = Description,
                CreatedAt = CreatedAt,
                UpdatedAt = UpdatedAt
            };
        }
    }

    public class ProjectDto
    {
        public string Slug { get; set; }
        public string Title { get; set; }
        public string Summary { get; set; }
        public List<string> Technologies { get; set; }
        public string GithubUrl { get; set; }
        public string LiveUrl { get; set; }
        public CoverImage CoverImage { get; set; }
        public List<string> Features { get; set; }
        public string Status { get; set; }
        public DateTime StartDate { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}