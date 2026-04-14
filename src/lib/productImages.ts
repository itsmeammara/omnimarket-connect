import headphones from '@/assets/products/headphones.jpg';
import tshirt from '@/assets/products/tshirt.jpg';
import smartwatch from '@/assets/products/smartwatch.jpg';
import coffee from '@/assets/products/coffee.jpg';
import bag from '@/assets/products/bag.jpg';
import lamp from '@/assets/products/lamp.jpg';
import shoes from '@/assets/products/shoes.jpg';
import pourover from '@/assets/products/pourover.jpg';

export const productImages: Record<string, string> = {
  headphones,
  tshirt,
  smartwatch,
  coffee,
  bag,
  lamp,
  shoes,
  pourover,
};

export function getProductImage(imageKey: string): string {
  return productImages[imageKey] || headphones;
}
