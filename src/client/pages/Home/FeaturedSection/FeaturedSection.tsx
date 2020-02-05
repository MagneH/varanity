import React from 'react';
import { Section } from '../../../components/Section/Section';

// Styles
import classes from './FeaturedSection.module.scss';
import {urlFor} from "../../../services/SanityService";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux";
import {ArticleModel} from "../../Article";
import {SanityDocument} from "@sanity/client";

// Exports
export const FeaturedSection = () => {
  const [featuredArticle] = useSelector<RootState, ArticleModel>(state => {
    return Object.values(state.documents.data).filter(
      (document: SanityDocument) => document._type === 'article' && document.isFeatured === true,
    );
  });
  const { ingress, title, mainImage } = featuredArticle;
  return (
    <section className={classes.featuredSection}>
      {mainImage && mainImage.asset && mainImage.asset._ref && (
        <picture className={classes.featuredSectionImageContainer}>
          <source type="image/webp" srcSet={[urlFor(mainImage.asset._ref).format('webp').width(2000).fit('max').url()]}/>
          <img src={urlFor(mainImage.asset._ref).width(150).height(150).fit('max').url()} alt=""/>
        </picture>)
      }
      <h2 className={classes.featuredSectionTitle}>{title}</h2>
      {ingress && <small className={classes.featuredSectionIngress}>{ingress}</small>}
    </section>
)};
