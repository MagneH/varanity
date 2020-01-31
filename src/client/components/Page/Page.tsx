import React from 'react';
import { PageModel } from '../../pages/Page';
import { Blocks } from '../Blocks';

import classes from './Page.module.scss';

interface Props {
  page: PageModel;
}

const PageComponent: React.FC<Props> = ({ page }: Props) => {
  return page ? (
    <section className={classes.page}>
      <h2 className={classes.pageTitle}>{page.title}</h2>
    </section>
  ) : null;
};

export { PageComponent };
