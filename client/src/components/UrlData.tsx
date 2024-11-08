import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Alert, IconButton, Link } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';
import { copyToClipboard } from '../utils';

interface UrlDataType {
  isSuccess: boolean;
  isError: boolean;
  shortenUrlKey: string | undefined;
}

const UrlData = ({
  isSuccess,
  isError,
  shortenUrlKey,
}: UrlDataType): JSX.Element => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const shortenUrl = `${window.location.origin}/${shortenUrlKey}`;

  const handleOnClick = (): void => {
    copyToClipboard(shortenUrl);
    setIsCopied(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsCopied(false), 1300);
    return () => {
      clearTimeout(timer);
    };
  }, [isCopied]);

  return (
    <>
      {(isSuccess && (
        <Alert
          variant="outlined"
          severity="success"
          sx={{
            mt: 2,
          }}
          action={
            <IconButton
              aria-label="copy"
              color="inherit"
              onClick={handleOnClick}
            >
              {isCopied ? <DoneIcon /> : <ContentCopyIcon />}
            </IconButton>
          }
        >
          <Link
            target='_blank'
            color="inherit"
            component={RouterLink}
            to={`/${shortenUrlKey}`}
          >
            {shortenUrl}
          </Link>
        </Alert>
      )) ||
        (isError && (
          <Alert
            severity="error"
            sx={{
              mt: 2,
            }}
          >
            Oops, something went wrong.. Please try again.
          </Alert>
        ))}
    </>
  );
};

export default UrlData;
