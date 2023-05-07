import { Button, HStack, Link, Text } from "native-base";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/auth-context";
import { truncateString } from "../utils";
import { useAuth } from "../hooks/useAuth";
import { Role } from "../repository";
import { BiDownArrow } from "react-icons/bi";
import { FiUpload } from "react-icons/fi";
import { Pressable } from "react-native";
export function Links() {
  const navigate = useNavigate();
  const {
    state: {
      userDetails: { id_, role },
      isUserLoggedIn,
    },
  } = useAuthContext();
  const { connect } = useAuth();
  return (
    <HStack
      flexDir={["column", "row"]}
      space={"5"}
      alignItems={"center"}
      mr="5"
    >
      <NavLink
        className={(navData) => (navData.isActive ? "link-active" : "link")}
        to="/dashboard"
      >
        <Text color="white" fontSize="lg">
          Dashboard
        </Text>
      </NavLink>
     
      {role === Role.Customer && (
        <Pressable onPress={() => navigate("/profile")}>
          <FiUpload size={25} color="white" style={{ marginRight: "20px" }} />
        </Pressable>
      )}
      <Button
        _hover={{ bg: "white", color: "primary.500" }}
        size="lg"
        mt={["5", "0"]}
        rightIcon={
          <BiDownArrow
            color="#67e8f9"
            display={
              role === Role.Bank || role === Role.Customer ? "block" : "none"
            }
          />
        }
        onPress={() =>
          isUserLoggedIn
            ? (role === Role.Customer || role === Role.Bank) &&
              navigate("/profile")
            : connect()
        }
        variant={"outline"}
      >
        {isUserLoggedIn ? truncateString(id_) : "Connect"}
      </Button>
    </HStack>
  );
}
