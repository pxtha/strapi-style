import type { Schema, Attribute } from '@strapi/strapi';

export interface BannerBanner extends Schema.Component {
  collectionName: 'components_banner_banners';
  info: {
    displayName: 'Banner';
    icon: 'apps';
    description: '';
  };
  attributes: {
    hero_products: Attribute.Relation<
      'banner.banner',
      'oneToMany',
      'api::product.product'
    >;
    side_products: Attribute.Relation<
      'banner.banner',
      'oneToMany',
      'api::product.product'
    >;
  };
}

export interface DealOutletDealsAndOutlet extends Schema.Component {
  collectionName: 'components_deal_outlet_deals_and_outlets';
  info: {
    displayName: 'Deals & Outlet';
    icon: 'star';
    description: '';
  };
  attributes: {};
}

export interface DealDeals extends Schema.Component {
  collectionName: 'components_deal_deals';
  info: {
    displayName: 'Deals';
    icon: 'archive';
    description: '';
  };
  attributes: {
    deal_of_the_day_1: Attribute.Relation<
      'deal.deals',
      'oneToOne',
      'api::product.product'
    >;
    deal_of_the_day_2: Attribute.Relation<
      'deal.deals',
      'oneToOne',
      'api::product.product'
    >;
  };
}

export interface FeatureFeature extends Schema.Component {
  collectionName: 'components_feature_features';
  info: {
    displayName: 'Feature';
    icon: 'shoppingCart';
  };
  attributes: {
    products: Attribute.Relation<
      'feature.feature',
      'oneToMany',
      'api::product.product'
    >;
  };
}

export interface OrginalOrginal extends Schema.Component {
  collectionName: 'components_orginal_orginals';
  info: {
    displayName: 'orginal';
  };
  attributes: {
    orginal: Attribute.String;
  };
}

export interface PageHeroBanner extends Schema.Component {
  collectionName: 'components_page_hero_banners';
  info: {
    displayName: 'hero banner';
    icon: 'cube';
  };
  attributes: {
    title: Attribute.String;
    cover: Attribute.Media;
  };
}

export interface PageQuestions extends Schema.Component {
  collectionName: 'components_page_questions';
  info: {
    displayName: 'Questions';
    icon: 'bulletList';
  };
  attributes: {
    question: Attribute.String;
    answers: Attribute.Blocks;
  };
}

export interface PageTestimonial extends Schema.Component {
  collectionName: 'components_page_testimonials';
  info: {
    displayName: 'testimonial';
    icon: 'emotionHappy';
  };
  attributes: {
    testimonial: Attribute.Text;
    userprofile: Attribute.Media;
  };
}

export interface TopSellingTopSelling extends Schema.Component {
  collectionName: 'components_top_selling_top_sellings';
  info: {
    displayName: 'Top Selling';
    icon: 'crown';
  };
  attributes: {
    categories: Attribute.Relation<
      'top-selling.top-selling',
      'oneToMany',
      'api::category.category'
    >;
    products: Attribute.Relation<
      'top-selling.top-selling',
      'oneToMany',
      'api::product.product'
    >;
  };
}

export interface VendorVendor extends Schema.Component {
  collectionName: 'components_vendor_vendors';
  info: {
    displayName: 'vendor';
    description: '';
  };
  attributes: {
    vendors: Attribute.Relation<
      'vendor.vendor',
      'oneToMany',
      'api::vendor.vendor'
    >;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'banner.banner': BannerBanner;
      'deal-outlet.deals-and-outlet': DealOutletDealsAndOutlet;
      'deal.deals': DealDeals;
      'feature.feature': FeatureFeature;
      'orginal.orginal': OrginalOrginal;
      'page.hero-banner': PageHeroBanner;
      'page.questions': PageQuestions;
      'page.testimonial': PageTestimonial;
      'top-selling.top-selling': TopSellingTopSelling;
      'vendor.vendor': VendorVendor;
    }
  }
}
