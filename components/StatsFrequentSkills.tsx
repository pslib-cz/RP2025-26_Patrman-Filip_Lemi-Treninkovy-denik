import { getFrequentSkills } from "@/services/stats.service";

interface Props {
  filter: string;
  userId: string;
}

export default async function StatsFrequentSkills({ filter, userId }: Props) {
    const skills = await getFrequentSkills(userId, filter);
    
    const topThree = skills.slice(0, 3);
    
    const highestCount = topThree.length > 0 ? topThree[0].count : 1;

    return (
    <div className="flex flex-col rounded-2xl bg-card p-6 shadow-sm border border-border h-full col-span-2"> 
      <h3 className="text-black font-bold mb-6">
        Most frequent skills
      </h3>
      
      <div className="w-full flex flex-col gap-6">
         
         {topThree.map((skill) => (
             <div key={skill.code} className="w-full">
                <div className="flex justify-between items-end mb-2">
                    <h4 className="text-black font-bold">{skill.name} <span className="text-muted-foreground text-sm ml-2">({skill.code})</span></h4>
                    <p className="font-bold text-primary">{skill.count}x</p>
                </div>
                
                
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(skill.count / highestCount) * 100}%` }}
                    />
                </div>
             </div>
         ))}

      </div>
    </div>
  );
}
