using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace backend.Models;

public partial class FilharmoniaContext : DbContext
{
    public FilharmoniaContext()
    {
    }

    public FilharmoniaContext(DbContextOptions<FilharmoniaContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Composer> Composers { get; set; }

    public virtual DbSet<Concert> Concerts { get; set; }

    public virtual DbSet<Programme> Programmes { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql("Server=localhost:6543;Database=filharmonia;Username=admin;Password=admin");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Composer>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("composers_pkey");

            entity.ToTable("composers");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Composer1)
                .HasMaxLength(200)
                .HasColumnName("composer");
            entity.Property(e => e.ConcertId).HasColumnName("concert_id");

            entity.HasOne(d => d.Concert).WithMany(p => p.Composers)
                .HasForeignKey(d => d.ConcertId)
                .HasConstraintName("composers_concert_id_fkey");
        });

        modelBuilder.Entity<Concert>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("concerts_pkey");

            entity.ToTable("concerts");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ConcertType)
                .HasMaxLength(200)
                .HasColumnName("concert_type");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_at");
            entity.Property(e => e.Date)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("date");
            entity.Property(e => e.DetailsLink)
                .HasMaxLength(500)
                .HasColumnName("details_link");
            entity.Property(e => e.ModifiedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("modified_at");
            entity.Property(e => e.Source)
                .HasMaxLength(200)
                .HasColumnName("source");
            entity.Property(e => e.Title)
                .HasMaxLength(300)
                .HasColumnName("title");
            entity.Property(e => e.Venue)
                .HasMaxLength(200)
                .HasColumnName("venue");
        });

        modelBuilder.Entity<Programme>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("programmes_pkey");

            entity.ToTable("programmes");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ConcertId).HasColumnName("concert_id");
            entity.Property(e => e.Piece)
                .HasMaxLength(400)
                .HasColumnName("piece");

            entity.HasOne(d => d.Concert).WithMany(p => p.Programmes)
                .HasForeignKey(d => d.ConcertId)
                .HasConstraintName("programmes_concert_id_fkey");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
