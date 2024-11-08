import { Typography } from '@mui/material';
import { useSubmitUrlMutation } from '../slices/urlsApiSlice';
import UrlData from '../components/UrlData';
import UrlForm from '../components/UrlForm';

const HomePage = (): JSX.Element => {
  const [
    trigger,
    {
      data,
      isLoading,
      isSuccess,
      isError,
    },
  ] = useSubmitUrlMutation();

  return (
    <>
      <Typography
        component="h1"
        variant="h4"
        color="primary"
        align="center"
        gutterBottom
      >
        Create Short URLs
      </Typography>
      <Typography variant="subtitle1" align="center" sx={{ mb: 4 }}>
        This application makes long links look cleaner and easier to share!
      </Typography>
      <UrlForm
        isSuccess={isSuccess}
        isLoading={isLoading}
        trigger={(originalUrl: string) => trigger({ originalUrl })}
      />
      <UrlData
        isSuccess={isSuccess}
        isError={isError}
        shortenUrlKey={data}
      />
    </>
  );
};

export default HomePage;
