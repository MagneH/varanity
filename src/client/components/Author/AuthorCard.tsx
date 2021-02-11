import React from 'react';
import { AuthorPicture } from './AuthorPicture';
import { AuthorModel } from '../../redux/modules/authors';
import classes from './AuthorCard.module.scss';

interface AuthorCardProps {
  author: AuthorModel;
}

export const AuthorCard = ({ author }: AuthorCardProps) => (
  <div className={classes.authorCard}>
    <AuthorPicture image={author.image} />
    <div className={classes.authorInfoContainer}>
      <p className={classes.authorName}>{author.name}</p>
    </div>
  </div>
);
