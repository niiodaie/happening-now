import { Badge } from '@/components/ui/badge'

export function FilterTabs({ tags, selectedTag, onTagSelect }) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant={selectedTag === tag ? "default" : "outline"}
            className={`cursor-pointer transition-all hover:scale-105 ${
              selectedTag === tag 
                ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                : 'hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700'
            }`}
            onClick={() => onTagSelect(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  )
}

