using System.Text.Json;
using System.Text.Json.Serialization;
using lukes_site.Server.Models;

namespace lukes_site.Server.Services
{
    public class ProjectService : IProjectService
    {
        private readonly string _projectsDirectory;
        private readonly ILogger<ProjectService> _logger;
        private readonly JsonSerializerOptions _jsonOptions;

        public ProjectService(IWebHostEnvironment env, ILogger<ProjectService> logger)
        {
            _projectsDirectory = Path.Combine(env.ContentRootPath, "projects");
            _logger = logger;
            
            _logger.LogInformation("ContentRootPath: {ContentRootPath}", env.ContentRootPath);
            _logger.LogInformation("Projects Directory Path: {ProjectsDirectory}", _projectsDirectory);
            
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
                WriteIndented = true
            };

            // Ensure projects directory exists
            if (!Directory.Exists(_projectsDirectory))
            {
                Directory.CreateDirectory(_projectsDirectory);
                _logger.LogInformation("Created projects directory: {Directory}", _projectsDirectory);
            }
        }

        public async Task<IEnumerable<ProjectDto>> GetAllProjectsAsync()
        {
            try
            {
                var files = Directory.GetFiles(_projectsDirectory, "*.json", SearchOption.AllDirectories);
                _logger.LogInformation("Found {Count} JSON files", files.Length);

                var projects = new List<Project>();

                foreach (var file in files)
                {
                    try
                    {
                        var json = await File.ReadAllTextAsync(file);
                        var project = JsonSerializer.Deserialize<Project>(json, _jsonOptions);

                        if (project != null)
                        {
                            var fileInfo = new FileInfo(file);
                            project.CreatedAt = fileInfo.CreationTime;
                            project.UpdatedAt = fileInfo.LastWriteTime;
                            projects.Add(project);
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error processing file {File}", file);
                    }
                }

                return projects.OrderByDescending(p => p.CreatedAt).Select(p => p.ToDto());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all projects");
                return Enumerable.Empty<ProjectDto>();
            }
        }

        public async Task<ProjectDto?> GetProjectBySlugAsync(string slug)
        {
            var projects = await GetAllProjectsAsync();
            return projects.FirstOrDefault(p => p.Slug.Equals(slug, StringComparison.OrdinalIgnoreCase));
        }

        public async Task<IEnumerable<ProjectDto>> GetProjectsByTechnologyAsync(string technology)
        {
            var projects = await GetAllProjectsAsync();
            return projects.Where(p => p.Technologies.Contains(technology, StringComparer.OrdinalIgnoreCase));
        }

        public async Task<IEnumerable<string>> GetAllTechnologiesAsync()
        {
            var projects = await GetAllProjectsAsync();
            return projects
                .SelectMany(p => p.Technologies)
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .OrderBy(t => t);
        }
    }
}