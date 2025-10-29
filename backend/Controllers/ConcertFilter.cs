namespace backend.Controllers;

public class ConcertFilter
{
    public DateTime StartDate { get; set; } = System.DateTime.Now;
    public DateTime? EndDate { get; set; }
    public string? ConcertTitle { get; set; }
    public string? ConcertType { get; set; }
    public string? Venue { get; set; }
    public string? Source { get; set; }
    public string? Composers { get; set; }
    public string? Programme { get; set; }
}
