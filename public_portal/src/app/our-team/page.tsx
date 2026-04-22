import { Metadata } from 'next';
import { TeamMember } from '@/types';
import { getTeamMembers } from '@/lib/api/team';
import { getServerLanguage } from '@/lib/utils/language';

interface TeamPageProps {
  searchParams?: { lang?: string };
}



export const revalidate = 120;

export async function generateMetadata({}: TeamPageProps): Promise<Metadata> {
  return {
    title: 'Our Team - HTC Media',
    description: 'Meet the team behind HTC Media',
  };
}

export default async function TeamPage({ searchParams }: TeamPageProps) {
  const lang = (searchParams?.lang === 'en' || searchParams?.lang === 'ne') ? searchParams.lang : 'ne';
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
                      <div className="mt-2 space-y-1">
                        {member.newsEmail && (
                          <a
                            href={`mailto:${member.newsEmail}`}
                            className="text-gray-500 text-xs hover:text-news-primary flex items-center gap-1"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {member.newsEmail}
                          </a>
                        )}
                        {member.facebook && (
                          <a
                            href={member.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 text-xs hover:text-news-primary flex items-center gap-1"
                          >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Facebook
                          </a>
                        )}
                      </div>
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