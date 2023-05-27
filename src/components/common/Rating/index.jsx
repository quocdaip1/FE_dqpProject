/* eslint-disable react/prop-types */
import React from "react";
import { Box, Icon, Stack } from "@chakra-ui/react";
import { HiOutlineStar, HiStar } from "react-icons/hi2";

const Rating = React.forwardRef(({ size, scale, disabled, onChange, value = 0 }, ref) => {
  const buttons = [];

  const onClick = (idx) => {
    if (!isNaN(idx)) {
      if (value === 1 && idx === 1) {
        onChange(1);
      } else {
        onChange(idx);
      }
    }
  };

  const RatingIcon = ({ fill }) => {
    return (
      <Icon
        as={fill ? HiStar : HiOutlineStar}
        size={`${size}px`}
        color="yellow.400"
        stroke="yellow.400"
        onClick={onClick}
        fillOpacity={fill ? "100%" : "0"}
      />
    );
  };

  const RatingButton = ({ idx, fill }) => {
    return (
      <Box
        as="button"
        aria-label={`Rate ${idx}`}
        variant="unstyled"
        onClick={() => onClick(idx)}
        marginLeft="0 !important"
        _focus={{ outline: 0 }}
        border="none"
        display="flex"
        alignItems="center"
        disabled={disabled}
        _disabled={{
          ":hover": {
            cursor: "not-allowed",
          },
        }}
      >
        <RatingIcon fill={fill} />
      </Box>
    );
  };

  for (let i = 1; i <= scale; i++) {
    buttons.push(<RatingButton key={i} idx={i} fill={i <= value} />);
  }

  return (
    <Stack isInline alignItems="center" marginTop="0px !important" title={value}>
      <input name="rating" type="hidden" value={value} ref={ref} />
      {buttons}
      {/* <Box width={`${size * 1.5}px`} textAlign="center">
        <Text fontSize="sm" fontWeight="semibold" lineHeight="1.2em">
          {value}
        </Text>
      </Box> */}
    </Stack>
  );
});

Rating.displayName = "Rating";

export default Rating;
