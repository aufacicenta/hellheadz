import { GetServerSidePropsContext, NextPage } from "next";
import { i18n, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

import { HomeLayout } from "layouts/home-layout/HomeLayout";
import { Larskristo } from "ui/svpervnder/artists/larskristo/Larskristo";

const Index: NextPage = () => {
  const { t } = useTranslation("head");

  return (
    <HomeLayout>
      <Head>
        <title>{t("head.og.title")}</title>
        <meta name="description" content={t("head.og.description")} />
        <meta property="og:title" content={t("head.og.title")} />
        <meta property="og:description" content={t("head.og.description")} />
      </Head>

      <Larskristo />
    </HomeLayout>
  );
};

export const getServerSideProps = async ({ locale }: GetServerSidePropsContext) => {
  await i18n?.reloadResources();

  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common", "head", "chat", "prompt-wars"])),
    },
  };
};

export default Index;
