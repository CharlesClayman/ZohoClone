namespace API.Interfaces
{
    public interface IUrlService
    {
        string GenerateAbsoluteUrl(string path);

        string AppendUriQueryInfo(string endpointUri, IDictionary<string, string> queries);
    }
}