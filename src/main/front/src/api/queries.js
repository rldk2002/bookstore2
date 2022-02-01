import { useMutation, useQuery } from "react-query";
import ajax from "./axiosInterceptor";
import { queryKeys, queryKeywords } from "./queryKeys";

/*
 * 계정 인증
 */
export const useLoginJWT = () => {
	return useMutation(
		form => ajax.post("/auth/login/jwt", null, {
			params: {
				id: form["id"],
				password: form["password"]
			}
		}).then(response => {
			const { Authorization } = response;
			if (Authorization) {	// Access Token
				window.localStorage.setItem("Authorization", Authorization);
			}
			return response;
		})
	);
};
export const useAuthentication = () => {
	return useQuery(
		queryKeys.member([queryKeywords.principal]),
		() => ajax.get("/member/profile"), {
			staleTime: 1000 * 60 * 30,	// 30분
			cacheTime: 1000 * 60 * 30,	// 30분
			useErrorBoundary: false
		}
	);
}

/*
 * 책 API 조회
 */
export const useFetchBook = itemId => {
	return useQuery(
		queryKeys.book([{ itemId: itemId }]),
		() => ajax.get(`/books/item/${ itemId }`)
	);
}
export const useFetchBookListByCategory = (categoryId, corner) => {
	return useQuery(
		queryKeys.bookList([{ categoryId: categoryId, corner: corner }]),
		() => ajax.get(`/books/${ corner }/category/${ categoryId }`)
	);
}

/*
 * 북카트 관련
 */
export const useFetchBookCart = () => {
	return useQuery(
		queryKeys.bookCart([queryKeywords.principal]),
		() => ajax.get("/books/cart")
	);
}
/**
 * [mutateAsync:variables] 필수요소: itemId, count
 */
export const useAddBookToCart = () => {
	return useMutation(
		({ itemId, count }) => ajax.post("/books/cart", null, {
			params: {
				itemId: itemId,
				count: count
			}
		})
	);
}
/**
 * [mutateAsync:variables] 필수요소: itemId, count
 */
export const useModifyBookCartCount = () => {
	return useMutation(
		({ itemId, count }) => ajax.patch("/books/cart", null, {
			params: {
				itemId: itemId,
				count: count
			}
		})
	);
}
export const useRemoveBookCarts = () => {
	return useMutation(
		({ itemIds }) => ajax.delete("/books/cart", {
			params: {
				itemIds: itemIds.join(",")
			}
		})
	);
}

/*
 * 책 좋아요 관련
 */
/**
 * [mutateAsync:variables] 필수요소: itemId
 */
export const useToggleBookLike = () => {
	return useMutation(
		({ itemId }) => ajax.post("/books/like", null, {
			params: {
				itemId: itemId
			}
		})
	);
}
export const useFetchBookLike = itemId => {
	return useQuery(
		queryKeys.bookLike([queryKeywords.principal, { itemId: itemId }]),
		() => ajax.get(`/books/item/${ itemId }/like`), {
			staleTime: Infinity,
			cacheTime: Infinity,
			useErrorBoundary: false
		}
	);
}

