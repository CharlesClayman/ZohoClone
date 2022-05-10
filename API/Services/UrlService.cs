using API.Helpers;
using API.Interfaces;

using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;

namespace API.Services
{
    public class UrlService : IUrlService
    {
        private readonly ClientSettingOptions _clientSettings;

        public UrlService(IOptions<ClientSettingOptions> options)
        {
            _clientSettings = options.Value;
        }

        public string AppendUriQueryInfo(string endpointUri, IDictionary<string, string> queries)
        {
            return QueryHelpers.AddQueryString(endpointUri, queries);
        }

        public string GenerateAbsoluteUrl(string path)
        {
            var origin = _clientSettings.Host;

            var endpoint = new UriBuilder(origin)
            {
                Path = path
            };

            return endpoint.ToString();
        }
    }
}