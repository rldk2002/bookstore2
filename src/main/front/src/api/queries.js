import { useMutation, useQuery } from "react-query";
import ajax from "./axiosInterceptor";
import { queryKeys, queryKeywords } from "./queryKeys";

/*
 * 계정 인증 jwt
 */
/** 회원 로그인 여부 */
export const useAuthentication = () => {
	return useQuery(
		queryKeys.member([queryKeywords.principal]),
		() => ajax.get("/member/profile"), {
			staleTime: 0,
			cacheTime: 1000 * 60 * 30,	// 30분
			useErrorBoundary: false,
			retry: 3
		}
	);
}
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

/*
 * 책 API 조회
 */
export const useFetchBook = (itemId, options) => {
	return useQuery(
		queryKeys.book([{ itemId: itemId }]),
		() => ajax.get(`/books/item/${ itemId }`), {
			staleTime: Infinity,
			cacheTime: Infinity,
			...options
		}
	);
}
export const useFetchBookListByCategory = (categoryId, corner) => {
	return useQuery(
		queryKeys.bookList([{ categoryId: categoryId, corner: corner }]),
		() => ajax.get(`/books/${ corner }/category/${ categoryId }`),{
			staleTime: Infinity,
			cacheTime: Infinity
		}
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
		() => ajax.get(`/books/item/${ itemId }/like`)
	);
}

/*
 * 책 리뷰 관련
 */
export const useWriteBookReview = () => {
	return useMutation(
		({ itemId, content, starRating }) => ajax.post("/books/review", null, {
			params: {
				itemId: itemId,
				content: content,
				starRating: starRating
			}
		})
	);
};
export const useFetchBookReview = itemId => {
	return useQuery(
		queryKeys.bookReview([queryKeywords.principal, { itemId: itemId }]),
		() => ajax.get("/books/review", {
			params: {
				itemId: itemId
			}
		})
	);
}
export const useRemoveBookReview = () => {
	return useMutation(
		({ itemId }) => ajax.delete("/books/review", {
			params: {
				itemId: itemId
			}
		})
	);
}