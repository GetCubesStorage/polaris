import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';
import fs from 'fs';
import path from 'path';
import globby from 'globby';

import {
  serializeMdx,
  type SerializedMdx,
} from '../src/components/Markdown/serialize';
import Markdown from '../src/components/Markdown';
import Page from '../src/components/Page';
import PageMeta from '../src/components/PageMeta';
import {Status} from '../src/types';
import {parseMarkdown} from '../src/utils/markdown.mjs';
import {MarkdownFile} from '../src/types';

interface FrontMatter {
  title: string;
  noIndex?: boolean;
  status?: Status;
  update?: string;
  seoDescription?: string;
}

interface Props {
  mdx: SerializedMdx<FrontMatter>;
  seoDescription?: string;
  editPageLinkPath: string;
}

export interface WhatsNewListingProps {
  posts: {
    title: string;
    description: string;
    slug: string;
    imageUrl: string;
  }[];
}

const CatchAllTemplate = ({
  mdx,
  seoDescription,
  editPageLinkPath,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const {title, noIndex = false} = mdx.frontmatter;

  return (
    <Page editPageLinkPath={editPageLinkPath} isContentPage>
      <PageMeta title={title} description={seoDescription} noIndex={noIndex} />
      <Markdown {...mdx} />
    </Page>
  );
};

const contentDir = 'content';
const whatsNewDir = 'whats-new';

const getWhatsNew = () => {
  const globPath = path.resolve(process.cwd(), contentDir, whatsNewDir, '*.md');
  const paths = globby
    .sync(globPath)
    .filter((path) => !path.endsWith('index.md'));

  const posts: WhatsNewListingProps['posts'] = paths.map((path) => {
    const markdown = fs.readFileSync(path, 'utf-8');
    const {frontMatter}: MarkdownFile = parseMarkdown(markdown);
    const {title, description, imageUrl} = frontMatter;
    const slug = path.replace(contentDir, '').replace('.md', '');
    return {title, description, slug, imageUrl};
  });

  return posts;
};

export const getStaticProps: GetStaticProps<Props, {slug: string[]}> = async ({
  params,
}) => {
  const slug = params?.slug;
  if (!slug)
    throw new Error('Expected params.slug to be defined (as string[])');

  const slugPath = `${contentDir}/${params.slug.join('/')}`;
  const pathIsDirectory =
    fs.existsSync(slugPath) && fs.lstatSync(slugPath).isDirectory();
  const mdRelativePath = pathIsDirectory
    ? `${contentDir}/${params.slug.join('/')}/index.md`
    : `${contentDir}/${params.slug.join('/')}.md`;
  const mdFilePath = path.resolve(process.cwd(), mdRelativePath);
  const editPageLinkPath = `/polaris.shopify.com/${mdRelativePath}`;

  if (fs.existsSync(mdFilePath)) {
    const markdown = fs.readFileSync(mdFilePath, 'utf-8');

    let scope = {};

    if (pathIsDirectory && slugPath === 'content/whats-new') {
      const posts = getWhatsNew();

      scope = {
        posts,
      };
    }

    const [mdx, data] = await serializeMdx<FrontMatter>(markdown, {scope});

    const seoDescription =
      typeof mdx.frontmatter.seoDescription === 'string'
        ? mdx.frontmatter.seoDescription
        : (data.firstParagraph as string) ?? null;

    const props: Props = {
      mdx,
      seoDescription,
      editPageLinkPath,
    };

    return {props};
  } else {
    return {notFound: true};
  }
};

const catchAllTemplateExcludeList = [
  '/icons',
  '/foundations',
  '/design',
  '/content',
  '/patterns',
  '/patterns-legacy',
  '/tools',
  '/tokens',
  '/sandbox',
  '/new-design-language',
];

function fileShouldNotBeRenderedWithCatchAllTemplate(path: string): boolean {
  return (
    !path.startsWith('/components') &&
    !path.includes('/tools/stylelint-polaris/rules') &&
    // We want to render legacy pages but not new pattern pages.
    !(path.startsWith('/patterns') && !path.startsWith('/patterns-legacy')) &&
    !catchAllTemplateExcludeList.includes(path)
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const globPath = [
    path.resolve(process.cwd(), 'content/*.md'),
    path.resolve(process.cwd(), 'content/**/*.md'),
    path.resolve(process.cwd(), 'content/**/**/*.md'),
    path.resolve(process.cwd(), 'content/**/**/**/*.md'),
  ];
  const paths = globby
    .sync(globPath)
    .map((fileName: string) => {
      return fileName
        .replace(`${process.cwd()}/content`, '')
        .replace('/index.md', '')
        .replace('.md', '');
    })
    .filter(fileShouldNotBeRenderedWithCatchAllTemplate);

  return {
    paths,
    fallback: false,
  };
};

export default CatchAllTemplate;
