import {
  ActionIcon,
  Badge,
  Box,
  Button,
  ColorSchemeProvider,
  Group,
  InputWrapper,
  MantineProvider,
  Header as HeaderSection,
  Select,
  useMantineColorScheme,
} from '@mantine/core';
import { Input } from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import {
  NotificationsProvider,
  showNotification,
  updateNotification,
} from '@mantine/notifications';
import { RichTextEditor } from '@mantine/rte';
import { useMemo, useState } from 'react';
import {
  ArrowBigRightLine,
  Article,
  Category,
  Checklist,
  CloudOff,
  H1,
  MoonStars,
  Photo,
  Sun,
  Upload,
  User,
  X,
} from 'tabler-icons-react';

const SCHEMA = {
  title: '',
  summary: '',
  category: '',
  author: '',
  photo: '',
  content: '',
};

function Header({ setBody, body }) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  const handleUploadBtn = async () => {
    try {
      showNotification({
        id: 'notif-send',
        loading: true,
        disallowClose: true,
        autoClose: false,
        title: 'Sending...',
        message: 'Trying to send your blog to the server',
      });
      const res = await fetch(import.meta.env.VITE_API_URL + 'blogs', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.status === 200) {
        updateNotification({
          id: 'notif-send',
          disallowClose: false,
          autoClose: 5000,
          loading: false,
          title: 'Success!',
          message: `your blog with id ${await res.json()} is stored on the server`,
          color: 'green',
          icon: <Checklist />,
        });
        setBody(SCHEMA);
      } else {
        updateNotification({
          id: 'notif-send',
          disallowClose: false,
          autoClose: 5000,
          loading: false,
          title: 'Error!',
          message: `failed send to server`,
          color: 'red',
          icon: <X />,
        });
      }
    } catch (e) {
      updateNotification({
        id: 'notif-send',
        disallowClose: false,
        autoClose: 5000,
        loading: false,
        title: 'Error!',
        message: `failed send to server`,
        color: 'red',
        icon: <CloudOff />,
      });
    }
  };

  return (
    <HeaderSection
      sx={(theme) => ({
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[5]
            : theme.colors.gray[4],
      })}
      mb={'md'}
    >
      <div className="container flex items-center justify-between py-2">
        <div>
          <Badge variant="dot" size="lg">
            SFOS BLOG MANAGEMENT
          </Badge>
        </div>
        <div>
          <Group>
            <ActionIcon
              variant="outline"
              color={dark ? 'yellow' : 'blue'}
              onClick={() => toggleColorScheme()}
              title="Toggle color scheme"
            >
              {dark ? <Sun size={16} /> : <MoonStars size={16} />}
            </ActionIcon>
            <Button
              leftIcon={<Upload size={16} />}
              size="xs"
              variant="outline"
              onClick={handleUploadBtn}
            >
              Upload
            </Button>
          </Group>
        </div>
      </div>
    </HeaderSection>
  );
}

function FormInfo({ body, setBody }) {
  return (
    <InputWrapper labelElement="div" className="mb-4 flex flex-wrap gap-4">
      <Input
        variant="filled"
        radius={'md'}
        icon={<H1 />}
        placeholder="Write your title..."
        className="flex-1"
        value={body.title}
        onChange={(ev) => setBody({ title: ev.currentTarget.value })}
      />
      <Input
        variant="filled"
        radius={'md'}
        icon={<Photo />}
        placeholder="Paste your image url..."
        className="flex-1"
        value={body.photo}
        onChange={(ev) => setBody({ photo: ev.currentTarget.value })}
      />
      <Input
        variant="filled"
        radius={'md'}
        icon={<Article />}
        placeholder="Write your Summary..."
        className="w-full"
        value={body.summary}
        onChange={(ev) => setBody({ summary: ev.currentTarget.value })}
      />
      <Select
        variant="filled"
        radius={'md'}
        icon={<Category />}
        placeholder="Category"
        className="flex-1"
        value={body.category}
        onChange={(category) => setBody({ category })}
        data={[
          { value: 'gaming', label: 'Gaming' },
          { value: 'technology', label: 'Technology' },
          { value: 'anime', label: 'Anime' },
          { value: 'school', label: 'School' },
          { value: 'world', label: 'World' },
          { value: 'horror', label: 'Horror' },
        ]}
      />
      <Input
        variant="filled"
        radius={'md'}
        icon={<User />}
        placeholder="Your name..."
        className="flex-1"
        value={body.author}
        onChange={(ev) => setBody({ author: ev.currentTarget.value })}
      />
    </InputWrapper>
  );
}

function Editor({ body, setBody }) {
  const modules = useMemo(
    () => ({
      history: { delay: 2500, userOnly: true },
    }),
    []
  );
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <RichTextEditor
      controls={[
        ['bold', 'italic', 'underline', 'strike', 'clean'],
        ['h2', 'h3', 'h4'],
        ['unorderedList', 'orderedList'],
        ['link', 'video', 'blockquote', 'codeBlock', 'code'],
        ['alignLeft', 'alignCenter', 'alignRight'],
        ['sup', 'sub'],
      ]}
      value={body.content}
      onChange={(content) => setBody({ content })}
      sx={(theme) => ({
        '&:focus-within': {
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: theme.colors.blue[5],
        },
      })}
      modules={modules}
      classNames={{
        root: `prose max-w-full ${dark ? 'prose-invert' : ''}`,
      }}
    />
  );
}

function Workspace({ body, setBody }) {
  return (
    <section>
      <div className="container  flex flex-col flex-wrap gap-4 lg:flex-row">
        <div className="flex-1">
          <FormInfo setBody={setBody} body={body} />
          <Editor body={body} setBody={setBody} />
        </div>
        <div className="relative flex-1">
          <div className="sticky top-0">
            <Box
              sx={(theme) => ({
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor:
                  theme.colorScheme === 'dark'
                    ? theme.colors.dark[5]
                    : theme.colors.gray[4],
              })}
              className="flex h-auto w-full flex-col-reverse justify-between overflow-hidden rounded-lg"
            >
              <div className="flex w-full flex-col justify-between gap-y-2 p-2">
                <img
                  src={body.photo}
                  alt={body.title}
                  loading="lazy"
                  className="max-h-60 w-full rounded-t-lg object-cover object-center"
                />
                <div>
                  <Badge>{body.category}</Badge>
                  <h3 className="my-1 text-2xl font-bold sm:text-3xl md:my-2">
                    {body.title}
                  </h3>
                  <p className="mb-4 font-light">
                    {new Date().toLocaleString()}. By {body.author}
                  </p>
                  <p className="mb-3 line-clamp-3">{body.summary}</p>
                </div>
                <div className="flex w-full justify-between">
                  <Button radius={'xl'} leftIcon={<ArrowBigRightLine />}>
                    Read more
                  </Button>
                </div>
              </div>
            </Box>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [body, setBody] = useSetState(SCHEMA);
  const [colorScheme, setColorScheme] = useState('light');
  // prettier-ignore
  const toggleColorScheme = (value) => setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <NotificationsProvider>
          <Header body={body} setBody={setBody} />
          <Workspace setBody={setBody} body={body} />
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
