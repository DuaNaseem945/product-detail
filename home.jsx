import {
  Box,
  Button,
  Container,
  Heading,
  Image,
  Input,
  SimpleGrid,
  Text,
  VStack,
  useColorModeValue,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../store/product";

function Home() {
  const {
    products,
    setProducts,
    updateProduct,
    deleteProduct,
  } = useProductStore();

  const toast = useToast();
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load products",
          status: "error",
          isClosable: true,
        });
      }
    };
    fetchProducts();
  }, [setProducts, toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct({ ...editingProduct, [name]: value });
  };

  const handleUpdate = async () => {
    const { _id, name, price, image } = editingProduct;
    const { success, message } = await updateProduct(_id, { name, price, image });

    if (success) {
      toast({
        title: "Success",
        description: message,
        status: "success",
        isClosable: true,
      });
      setEditingProduct(null);
    } else {
      toast({
        title: "Error",
        description: message,
        status: "error",
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id) => {
    const { success, message } = await deleteProduct(id);
    toast({
      title: success ? "Deleted" : "Error",
      description: message,
      status: success ? "success" : "error",
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.xl" py={12}>
      <VStack spacing={10} align="center" w="full">
        <Text
          fontSize="30"
          fontWeight="bold"
          bgGradient="linear(to-r, cyan.400, blue.500)"
          bgClip="text"
          textAlign="center"
        >
          Product List 🚀
        </Text>

        {/* ✅ Tabs Section */}
        <Tabs variant="enclosed" size="md" w="full" maxW="1000px">
          <TabList justifyContent="center">
            <Tab fontSize="lg" py={4} px={6}>
              All Products
            </Tab>
            <Tab fontSize="lg" py={4} px={6}>
              On Sale
            </Tab>
          </TabList>

          <TabPanels>
            {/* ✅ All Products Panel */}
            <TabPanel>
              <Box w="full" display="flex" justifyContent="center">
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 3 }}
                  spacing={10}
                  maxW="1000px"
                  w="full"
                >
                  {products.map((product) => (
                    <Box
                      key={product._id}
                      p={4}
                      bg={useColorModeValue("white", "gray.800")}
                      borderRadius="md"
                      boxShadow="md"
                      maxW="300px"
                      w="100%"
                      mx="auto"
                    >
                      {editingProduct?._id === product._id ? (
                        <VStack spacing={3}>
                          <Input
                            name="name"
                            value={editingProduct.name}
                            onChange={handleInputChange}
                          />
                          <Input
                            name="price"
                            type="number"
                            value={editingProduct.price}
                            onChange={handleInputChange}
                          />
                          <Input
                            name="image"
                            value={editingProduct.image}
                            onChange={handleInputChange}
                          />
                          <Button colorScheme="blue" onClick={handleUpdate} w="full">
                            Save
                          </Button>
                          <Button
                            colorScheme="gray"
                            onClick={() => setEditingProduct(null)}
                            w="full"
                          >
                            Cancel
                          </Button>
                        </VStack>
                      ) : (
                        <>
                          <Image
                            src={product.image}
                            alt={product.name}
                            borderRadius="md"
                            boxSize="200px"
                            objectFit="cover"
                            mx="auto"
                            mb={3}
                          />
                          <Text fontWeight="bold" fontSize="xl">
                            {product.name}
                          </Text>
                          <Text>Rs. {product.price}</Text>
                          <Button
                            mt={3}
                            size="sm"
                            colorScheme="yellow"
                            onClick={() => setEditingProduct(product)}
                            w="full"
                          >
                            Edit
                          </Button>
                          <Button
                            mt={2}
                            size="sm"
                            colorScheme="red"
                            onClick={() => handleDelete(product._id)}
                            w="full"
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>

              {products.length === 0 && (
                <Text
                  fontSize="xl"
                  textAlign="center"
                  fontWeight="bold"
                  color="gray.500"
                  mt={6}
                >
                  No products found 😢{" "}
                  <Link to="/create">
                    <Text
                      as="span"
                      color="blue.500"
                      _hover={{ textDecoration: "underline" }}
                    >
                      Create a product
                    </Text>
                  </Link>
                </Text>
              )}
            </TabPanel>

            {/* 🚧 On Sale Panel (You can add logic to filter sale products here) */}
            <TabPanel>
              <Text fontSize="lg" color="gray.400" textAlign="center">
                No sale products yet 😅
              </Text>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
}

export default Home;
