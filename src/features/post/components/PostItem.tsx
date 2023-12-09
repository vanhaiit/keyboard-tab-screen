import styled from '@emotion/native';
import { FC, useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import Comment from './Comment';
const PostItem: FC<any> = ({ item }) => {
  const [openComment, setOpenComment] = useState<boolean>(false);
  const { width: widthContent } = Dimensions.get('window');
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Container>
        <Header>
          <UserContainer>
            <Avatar
              source={{
                uri: item.image,
              }}
            />
            <UserInfo>
              <UserName>{item?.username}</UserName>
              <TimePost>10:00</TimePost>
            </UserInfo>
          </UserContainer>
          <Options>
            <Text>...</Text>
          </Options>
        </Header>
        <Content>
          <PostTitle>Title bai viet</PostTitle>
          <RenderHtml
            contentWidth={widthContent}
            source={{ html: item.postContent }}
          />
          <TagContainer>
            <TagItem>#name</TagItem>
            <TagItem>#oke</TagItem>
            <TagItem>#love</TagItem>
          </TagContainer>
          <ActionContainer>
            <TouchableOpacity>
              <Text>Like</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setOpenComment(true)}>
              <Text>Comment</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text>Emoji</Text>
            </TouchableOpacity>
          </ActionContainer>
        </Content>
        {openComment && <Comment />}
      </Container>
    </KeyboardAvoidingView>
  );
};

const Container = styled.View`
  background: white;
  margin-bottom: 10px;
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
  border-width: 0px;
`;

const Header = styled.View`
  display: flex;
  flex-direction: row;
  border-width: 0px;
  height: 50px;
  width: 100%;
  justify-content: space-between;
`;

const UserContainer = styled.View`
  display: flex;
  flex-direction: row;
  border-width: 0px;
`;
const UserInfo = styled.View`
  display: flex;
  margin-left: 10px;
  justify-content: space-between;
  padding: 3px 0px;
  border-width: 0px;
`;
const Avatar = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 100px;
`;

const UserName = styled.Text`
  border-width: 0px;
`;

const TimePost = styled.Text`
  border-width: 0px;
`;

const Options = styled.Text`
  font-size: 20px;
  margin: 0px 10px;
`;

const Content = styled.View`
  border-width: 0px;
`;

const PostTitle = styled.Text`
  font-size: 20px;
  border-width: 0px;
  margin: 10px 0px;
`;

const TagContainer = styled.View`
  heigh: 50px;
  width: 100%;
  display: flex;
  flex-direction: row;
  border-width: 0px;
`;
const TagItem = styled.Text`
  color: green;
  margin-right: 5px;
`;

const ActionContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
`;

export default PostItem;
