import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface SkillRadarProps {
  data: { skill: string; value: number }[];
  height?: number;
}

export function SkillRadar({ data, height = 260 }: SkillRadarProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
        <PolarGrid stroke="rgba(34,211,238,0.15)" />
        <PolarAngleAxis 
          dataKey="skill" 
          tick={{ fill: '#64748B', fontSize: 11, fontFamily: "'JetBrains Mono'" }} 
        />
        <Radar
          name="Skills"
          dataKey="value"
          stroke="#F97316"
          fill="#F97316"
          fillOpacity={0.2}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{ background: '#111318', border: '1px solid #1E2530', borderRadius: 8, color: '#F1F5F9', fontSize: 12 }}
          formatter={(val: number) => [val + '%', 'Score']}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
