import { Metadata } from 'next';
import { TeamMember } from '@/types';
import { getTeamMembers } from '@/lib/api/team';
import { getServerLanguage } from '@/lib/utils/language';

interface TeamPageProps {
  searchParams?: { lang?: string };
}

interface TeamMember {
  id: string;
  name: string;
  nameNe: string;
  department: string;
  departmentNe: string;
  designation: string;
  designationNe: string;
  image: string;
  bio?: string;
  bioNe?: string;
  email?: string;
  phone?: string;
}

export const revalidate = 120;

export async function generateMetadata({}: TeamPageProps): Promise<Metadata> {
  return {
    title: 'Our Team - HTC Media',
    description: 'Meet the team behind HTC Media',
  };
}

export default async function TeamPage({ searchParams }: TeamPageProps) {
  const lang = getServerLanguage();
  const result = await getTeamMembers();
  const members = result.success ? result.data : [];

  const pageTitle = lang === 'ne' ? 'हाम्रो टिम' : 'Our Team';
  const noMembers = lang === 'ne' 
    ? 'हालसम्म कुनै टिम सदस्य छैन।' 
    : 'No team members found.';

  // Group members by department
  const membersByDepartment: Record<string, TeamMember[]> = {};
  members.forEach((member) => {
    const dept = lang === 'ne' ? member.departmentNe : member.department;
    if (!membersByDepartment[dept]) {
      membersByDepartment[dept] = [];
    }
    membersByDepartment[dept].push(member);
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">{pageTitle}</h1>

      {members.length > 0 ? (
        <div className="space-y-12">
          {Object.entries(membersByDepartment).map(([department, deptMembers]) => (
            <div key={department}>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-news-red rounded-full" />
                {department}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {deptMembers.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white dark:bg-news-bg-dark rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="h-48 bg-gray-200 relative">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-300">
                          <span className="text-4xl text-gray-500">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">
                        {lang === 'ne' ? member.nameNe : member.name}
                      </h3>
                      <p className="text-news-primary text-sm">
                        {lang === 'ne' ? member.designationNe : member.designation}
                      </p>
                      {member.email && (
                        <p className="text-gray-500 text-xs mt-2">{member.email}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-12">{noMembers}</p>
      )}
    </div>
  );
}