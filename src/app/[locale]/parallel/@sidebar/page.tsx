export default function Page() {
  return <div>@sidebar</div>;
}

// @sidebar => 슬롯이라고한다.
// 여기에 보관된 페이지컴포넌트는 자신의 부모 레이아웃 컴포넌트인 레이아웃컴포넌트에게 props로써 자동으로 전달이 된다.
