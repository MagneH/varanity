import React, { ReactNode } from 'react';
import { SanityBlock } from '@sanity/client';

// Styles
import classes from './ArticleCard.module.scss';
import {urlFor} from "../../services/SanityService";
import {ArticleModel} from "../../pages/Article";

// Types
interface FeatureProps {
  article: ArticleModel
}

export const Article = ({ article }: FeatureProps) => {
  const { ingress, title, mainImage } = article;
  return (
  <div className={classes.post}>
    {article && mainImage && mainImage.asset && mainImage.asset._ref && (
      <picture className={classes.postImage}>
        <source type="image/webp" srcSet={[urlFor(mainImage.asset._ref).format('webp').width(300).height(250).fit('max').url()]}/>
        <img src={urlFor(mainImage.asset._ref).width(150).height(150).fit('max').url()} alt=""/>
      </picture>)
    }
    <h2 className={classes.postTitle}>{title}</h2>
    {ingress && <small className={classes.postIngress}>{ingress}</small>}
  </div>
)};
