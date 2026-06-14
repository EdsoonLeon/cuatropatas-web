import { PawPrint } from 'lucide-react';

export default function EmptyState({ title, description, icon: Icon = PawPrint }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="bg-muted rounded-full p-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <div className="text-center">
        <p className="font-medium">{title || 'Sin resultados'}</p>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}
