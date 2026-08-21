import { useNavigate } from 'react-router-dom';

function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-surface-muted relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="hr-container relative z-10">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-10 md:p-16 text-center shadow-card border border-surface-border">
          <div className="w-20 h-20 bg-accent-50 rounded-full flex items-center justify-center mx-auto mb-6 text-accent-500">
            <span className="material-symbols-outlined text-4xl">paid</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-text mb-6 tracking-tight">
            Ready to start earning?
          </h2>

          <p className="text-lg md:text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
            Join people in Addis Ababa who are making extra income by renting
            out items they aren't using every day. It's free to list!
          </p>

          <button
            type="button"
            className="hr-btn-primary !px-10 !py-4 !text-lg !rounded-xl"
            onClick={() => navigate('/listings/create')}
          >
            List an Item Now
          </button>
        </div>
      </div>
    </section>
  );
}

export default FinalCTA;