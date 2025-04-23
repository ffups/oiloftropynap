import type { Schema, Struct } from '@strapi/strapi';

export interface NavbarcategoryContact extends Struct.ComponentSchema {
  collectionName: 'components_navbarcategory_contacts';
  info: {
    displayName: 'contact';
  };
  attributes: {};
}

export interface NavbarcategoryNavbar extends Struct.ComponentSchema {
  collectionName: 'components_navbarcategory_navbars';
  info: {
    displayName: 'navbar';
  };
  attributes: {
    contact: Schema.Attribute.Component<'navbarcategory.contact', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'navbarcategory.contact': NavbarcategoryContact;
      'navbarcategory.navbar': NavbarcategoryNavbar;
    }
  }
}
