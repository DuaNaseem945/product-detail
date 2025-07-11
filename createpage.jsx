// src/pages/Createpage.jsx
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useProductStore } from '../store/product';

function Createpage() {
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    image: '',
  });

  const { createProduct } = useProductStore();

  const handleAddProduct = async () => {
    const { success, message } = await createProduct(newProduct);
    console.log('Product added:', newProduct);
    setNewProduct({ name: '', price: '', image: '' });
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={useColorModeValue('gray.100', 'gray.900')}
      px={4}
    >
      <Box
        w={{ base: '120%', md: '500px' }}
        bg={useColorModeValue('white', 'gray.700')}
        p={6}
        borderRadius="lg"
        boxShadow="md"
      >
        <VStack spacing={6}>
          <Heading size="lg" textAlign="center">
            Create New Product
          </Heading>
          <Input
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <Input
            placeholder="Product Price"
            type="number"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <Input
            placeholder="Image URL"
            value={newProduct.image}
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
          />
          <Button colorScheme="blue" w="full" onClick={handleAddProduct}>
            Add Product
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
}

export default Createpage;
