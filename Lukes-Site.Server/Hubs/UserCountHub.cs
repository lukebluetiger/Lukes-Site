using Microsoft.AspNetCore.SignalR;

namespace lukes_site.Server.Hubs
{
    public class UserCountHub : Hub
    {
        // Static counter to keep track of connected users
        private static int _currentUserCount = 0;

        // Method called when a client connects
        public override async Task OnConnectedAsync()
        {
            _currentUserCount++;
            await Clients.All.SendAsync("updateusercount", _currentUserCount);
            await base.OnConnectedAsync();
        }

        // Method called when a client disconnects
        public override async Task OnDisconnectedAsync(System.Exception exception)
        {
            _currentUserCount--;
            await Clients.All.SendAsync("updateusercount", _currentUserCount);
            await base.OnDisconnectedAsync(exception);
        }
    }
}
