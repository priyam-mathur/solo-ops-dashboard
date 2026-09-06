declare module 'weather/WeatherWidget' {
  const WeatherWidget: React.ComponentType<{ defaultCity?: string }>;
  export default WeatherWidget;
}

declare module 'todo/TodoWidget' {
  const TodoWidget: React.ComponentType<Record<string, unknown>>;
  export default TodoWidget;
}

declare module 'notes/NotesWidget' {
  const NotesWidget: React.ComponentType<Record<string, unknown>>;
  export default NotesWidget;
}

declare module 'analytics/AnalyticsWidget' {
  const AnalyticsWidget: React.ComponentType<Record<string, unknown>>;
  export default AnalyticsWidget;
}
