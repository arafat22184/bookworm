"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Genre {
  _id: string;
  name: string;
}

interface GenreFilterProps {
  genres: Genre[];
}

export function GenreFilter({ genres }: GenreFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Derive selected genres from URL params
  const selectedGenres = useMemo(() => {
    const genreParam = searchParams.get("genre");
    return genreParam ? genreParam.split(",") : [];
  }, [searchParams]);

  const toggleGenre = (genreId: string) => {
    const newSelection = selectedGenres.includes(genreId)
      ? selectedGenres.filter((id) => id !== genreId)
      : [...selectedGenres, genreId];

    updateURL(newSelection);
  };

  const clearFilters = () => {
    updateURL([]);
  };

  const updateURL = (genreIds: string[]) => {
    const params = new URLSearchParams(searchParams);

    if (genreIds.length > 0) {
      params.set("genre", genreIds.join(","));
    } else {
      params.delete("genre");
    }

    params.set("page", "1"); // Reset to first page on filter change
    router.push(`?${params.toString()}`);
  };

  const selectedCount = selectedGenres.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 relative">
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Genres</span>
          {selectedCount > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
              {selectedCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        align="end"
        className="w-64"
      >
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0">Filter by Genre</DropdownMenuLabel>
          {selectedCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-auto p-1 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-y-auto px-2 py-1">
          {genres.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2 text-center">
              No genres available
            </p>
          ) : (
            <div className="space-y-2">
              {genres.map((genre) => {
                const isSelected = selectedGenres.includes(genre._id);

                return (
                  <label
                    key={genre._id}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-accent rounded-md p-2 transition-colors"
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleGenre(genre._id)}
                      id={`genre-${genre._id}`}
                    />
                    <span className="text-sm flex-1">{genre.name}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
