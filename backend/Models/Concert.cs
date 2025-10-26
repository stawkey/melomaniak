using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Concert
{
    public int Id { get; set; }

    public DateTime? Date { get; set; }

    public string? Title { get; set; }

    public string? ConcertType { get; set; }

    public string? Venue { get; set; }

    public string? Source { get; set; }

    public string? DetailsLink { get; set; }

    public DateTime? ModifiedAt { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Composer> Composers { get; set; } = new List<Composer>();

    public virtual ICollection<Programme> Programmes { get; set; } = new List<Programme>();
}
