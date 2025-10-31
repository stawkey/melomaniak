namespace backend.Controllers;

public class SearchParameters
{
    const int MaxPageSize = 100;
    public int PageNumber { get; set; } = 1;
    private int _pageSize = 30;
    public int PageSize
    {
        get { return _pageSize; }
        set { _pageSize = (value > MaxPageSize) ? MaxPageSize : value; }
    }
    public ConcertFilter? Filters { get; set; }
}
