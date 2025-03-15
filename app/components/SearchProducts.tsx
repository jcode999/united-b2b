import { useState } from 'react';
import {
  Card,
  ResourceList,
  ResourceItem,
  Thumbnail,
  TextField,
  Button,
  InlineStack,
  BlockStack,
  Text,
} from '@shopify/polaris';

interface Product {
  id: string;
  title: string;
  imageUrl?: string;
  price: string;
}

interface ProductSearchProps {
  onSelectProduct: (product: Product) => void;
  fetchProducts: (query: string) => Promise<Product[]>;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ onSelectProduct, fetchProducts }) => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await fetchProducts(query);
      setProducts(results);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <BlockStack gap="400">
        <TextField
          label="Search products"
          value={query}
          onChange={setQuery}
          autoComplete="off"
          placeholder="Search by product name"
          clearButton
          onClearButtonClick={() => setQuery('')}
        />
        <Button onClick={handleSearch} loading={loading} variant='primary'>
          Search
        </Button>

        <ResourceList
          items={products}
          renderItem={(product) => {
            const { id, title, imageUrl, price } = product;
            return (
              <ResourceItem
                id={id}
                onClick={() => onSelectProduct(product)}
                accessibilityLabel={`Select ${title}`}
              >
                <InlineStack align="center" gap="400">
                  {imageUrl ? (
                    <Thumbnail source={imageUrl} alt={title} size="small" />
                  ) : (
                    <Thumbnail source="https://via.placeholder.com/40" alt="No Image" size="small" />
                  )}
                  <BlockStack>
                    <Text as="p" variant="bodyMd" fontWeight="bold">
                      {title}
                    </Text>
                    <Text as="p" variant="bodyMd">
                      ${price}
                    </Text>
                  </BlockStack>
                </InlineStack>
              </ResourceItem>
            );
          }}
        />
      </BlockStack>
    </Card>
  );
};

export default ProductSearch;
