import withSession from 'utils/withSession';
import Team from 'models/teams';
import { connectToDatabase } from 'utils/connectDb';

export default function TeamViewById({ user, team }) {
  return (
    <>
      <h2>{team.name}</h2>
      <p style={{ fontStyle: 'italic' }}>{user.jwt}</p>
    </>
  );
}

export const getServerSideProps = withSession(async function ({ query, req }) {
  try {
    const user = req.session.get('user');
    const { id: teamId } = query;

    if (!user) {
      return {
        redirect: {
          destination: '/auth/login',
          permanent: false,
        },
      };
    }

    await connectToDatabase();
    const team = await Team.findById(teamId).exec();

    return {
      props: {
        user,
        team: {
          name: team.name,
        },
      },
    };
  } catch (error) {
    console.log(error);
  }
});
