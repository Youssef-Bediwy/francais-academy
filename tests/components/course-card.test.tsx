import { describe, expect, it } from 'vitest';
import { render, screen } from '@tests/render';
import { CourseCard } from '@/components/domain/course-card';
import { makeCourseDto } from '@tests/factories/content';

describe('CourseCard', () => {
  it('affiche le titre francais et un lien vers le cours', () => {
    const course = makeCourseDto();
    render(<CourseCard course={course} />);

    expect(screen.getByRole('link', { name: course.title.fr })).toHaveAttribute(
      'href',
      `/fr/courses/${course.slug}`,
    );
    expect(screen.getByText(/4 leçons/)).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
  });

  it('bascule en arabe et pointe vers l URL arabe', () => {
    const course = makeCourseDto();
    render(<CourseCard course={course} />, { locale: 'ar' });

    expect(screen.getByRole('link', { name: course.title.ar })).toHaveAttribute(
      'href',
      `/ar/courses/${course.slug}`,
    );
  });

  it('affiche la barre de progression quand elle existe', () => {
    render(
      <CourseCard
        course={makeCourseDto({
          progress: { status: 'IN_PROGRESS', percentage: 35, timeSpentSeconds: 600, completedAt: null },
        })}
      />,
    );
    expect(screen.getByRole('progressbar', { name: 'Votre progression' })).toBeInTheDocument();
    expect(screen.getByText(/Continuer/)).toBeInTheDocument();
  });
});
